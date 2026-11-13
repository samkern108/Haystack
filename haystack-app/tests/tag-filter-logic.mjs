import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, ws: false } });
try {
  const { matchesIncludedTags, includedTagGroups, remapTagOperators, tagGroupingRanges, remapTagOrder, describeTagFilters } = await server.ssrLoadModule('/src/utils/tagfilterlogic.ts');
  const { initialState, reducer, getVideoFilterState, matchesFilterPreset } = await server.ssrLoadModule('/src/state/state.ts');
  const { filterVideoIdsByIncludedTags, filterVideosForCreator, filterVideosFromPlaylist } = await server.ssrLoadModule('/src/utils/videohelpers.tsx');
  const { AllCreators } = await server.ssrLoadModule('/src/state/types.ts');
  const tags = ['A', 'B', 'C'];
  // Exhaust all input combinations for each mixed expression and both uniform modes.
  for (const first of ['and', 'or']) for (const second of ['and', 'or']) {
    for (let mask = 0; mask < 8; mask++) {
      const [a, b, c] = [0, 1, 2].map((bit) => Boolean(mask & (1 << bit)));
      const expected = first === 'and'
        ? second === 'and' ? a && b && c : (a && b) || c
        : second === 'and' ? a || (b && c) : a || b || c;
      assert.equal(matchesIncludedTags(tags.filter((_, i) => mask & (1 << i)), tags, [first, second]), expected);
    }
  }
  assert.equal(matchesIncludedTags([], []), true);
  assert.equal(matchesIncludedTags(['b'], tags), true); // legacy OR, case insensitive
  assert.deepEqual(includedTagGroups(tags, ['and', 'or']), [['A', 'B'], ['C']]);
  assert.deepEqual(includedTagGroups(tags, ['or', 'and']), [['A'], ['B', 'C']]);
  assert.deepEqual(remapTagOperators(tags, ['A', 'C'], ['and', 'or']), ['or']);
  assert.deepEqual(remapTagOperators(tags, [...tags, 'D'], ['and', 'and']), ['and', 'and', 'or']);

  assert.deepEqual(tagGroupingRanges(tags, ['and', 'and']), []);
  assert.deepEqual(tagGroupingRanges(tags, ['and', 'and'], [1, 0]), []);

  // Toggling the right-hand connector groups B OR C, overriding AND precedence.
  assert.deepEqual(tagGroupingRanges(tags, ['and', 'or'], [1]), [[1, 2]]);
  assert.deepEqual(tagGroupingRanges(tags, ['and', 'or'], [0]), [[0, 1]]);
  for (let mask = 0; mask < 8; mask++) {
    const [a, b, c] = [0, 1, 2].map((bit) => Boolean(mask & (1 << bit)));
    assert.equal(matchesIncludedTags(tags.filter((_, i) => mask & (1 << i)), tags, ['and', 'or'], [1]), a && (b || c));
  }
  assert.deepEqual(remapTagOrder(tags, ['B', 'C'], [1, 0]), [0]);
  assert.deepEqual(remapTagOrder(tags, ['A', 'C'], [1, 0]), []);
  assert.deepEqual(tagGroupingRanges(['A', 'B', 'C', 'D'], ['or', 'and', 'or'], [0, 2]), [[0, 1], [2, 3]]);

  assert.equal(describeTagFilters(['video essay', 'video games', 'world of warcraft'], ['whatever'], ['and', 'or'], [1]),
    'Videos tagged video essay and video games, or video essay and world of warcraft. Excludes videos tagged whatever.');
  assert.equal(describeTagFilters(['A', 'B', 'C'], [], ['and', 'or'], [0]),
    'Videos tagged A and B, or C. No tags excluded.');
  assert.equal(describeTagFilters([], ['A', 'B']),
    'Videos with any tags, including untagged videos. Excludes videos tagged A or B.');
  assert.equal(describeTagFilters([], []), 'Videos with any tags, including untagged videos. No tags excluded.');

  const creator = Object.values(AllCreators).find((item) => Object.keys(item.videos).length >= 3);
  const ids = Object.keys(creator.videos).slice(0, 3);
  const tagState = { allTags: {}, allVideoTags: { [ids[0]]: ['A', 'B'], [ids[1]]: ['C'], [ids[2]]: ['A'] } };
  const creatorState = { ...initialState.creatorStates[creator.ucid], tags: [] };
  let state = { ...initialState, videoTagState: tagState };
  const filters = { ...getVideoFilterState(state), includeTags: tags, includeTagOperators: ['and', 'or'] };
  assert.deepEqual(filterVideoIdsByIncludedTags(ids, tags, tagState, creatorState, filters.includeTagOperators), ids.slice(0, 2));
  const candidateVideos = Object.fromEntries(ids.map((id) => [id, creator.videos[id]]));
  const expected = ids.slice(0, 2).map((id) => [creator.ucid, id]);
  assert.deepEqual(filterVideosForCreator(creator.ucid, creatorState, filters, candidateVideos, tagState), expected);
  assert.deepEqual(filterVideosFromPlaylist(ids.map((id) => [creator.ucid, id]), { [creator.ucid]: creatorState }, filters, tagState), expected);
  // Inherited tags participate in AND, except where explicitly excluded.
  assert.deepEqual(filterVideoIdsByIncludedTags(ids, ['A', 'B'], tagState, {
    ...creatorState, tags: ['B'], videoStates: { [ids[2]]: { creatorTagExceptions: ['B'] } },
  }, ['and']), [ids[0]]);

  state = reducer(state, { type: 'SET_VIDEO_FILTERS', filters });
  state = reducer(state, { type: 'SAVE_FILTER_PRESET', id: 'mixed', name: 'Mixed' });
  const saved = state.filterPresets.at(-1);
  assert.deepEqual(saved.filters.includeTagOperators, ['and', 'or']);
  assert.equal(matchesFilterPreset(filters, saved.filters), true);
  assert.equal(matchesFilterPreset({ ...filters, includeTagOperators: ['or', 'or'] }, saved.filters), false);
  assert.equal(matchesFilterPreset({ ...filters, includeTags: ['B', 'A', 'C'] }, saved.filters), true);
  state = reducer(state, { type: 'SET_VIDEO_FILTERS', filters: { ...state.videoFilterStates, includeTags: ['A', 'C'] } });
  assert.deepEqual(state.videoFilterStates.includeTagOperators, ['or']);
  state = reducer(state, { type: 'TOGGLE_FILTER_PRESET', id: 'mixed' });
  state = reducer(state, { type: 'TOGGLE_FILTER_PRESET', id: 'mixed' });
  assert.deepEqual(state.videoFilterStates.includeTagOperators, ['and', 'or']);
  assert.deepEqual(JSON.parse(JSON.stringify(state)).filterPresets.at(-1).filters.includeTagOperators, ['and', 'or']);
  state = reducer(state, { type: 'SET_VIDEO_FILTERS', filters: { ...state.videoFilterStates, includeTagOrder: [1] } });
  assert.equal(matchesFilterPreset(state.videoFilterStates, saved.filters), false);
  assert.deepEqual(filterVideosForCreator(creator.ucid, creatorState, state.videoFilterStates, candidateVideos, tagState), [expected[0]]);
  assert.deepEqual(filterVideosFromPlaylist(ids.map((id) => [creator.ucid, id]), { [creator.ucid]: creatorState }, state.videoFilterStates, tagState), [expected[0]]);
  state = reducer(state, { type: 'OVERWRITE_FILTER_PRESET', id: 'mixed' });
  assert.deepEqual(state.filterPresets.at(-1).filters.includeTagOrder, [1]);
  assert.equal(matchesFilterPreset(state.videoFilterStates, state.filterPresets.at(-1).filters), true);
  state = reducer(state, { type: 'TOGGLE_FILTER_PRESET', id: 'mixed' });
  state = reducer(state, { type: 'TOGGLE_FILTER_PRESET', id: 'mixed' });
  assert.deepEqual(state.videoFilterStates.includeTagOrder, [1]);
  console.log('Tag operator truth tables, grid/playlist filtering, inheritance, and preset checks passed.');
} finally {
  await server.close();
}
