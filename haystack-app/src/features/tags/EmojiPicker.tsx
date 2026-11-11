import { useEffect, useRef, useState } from "react";
import "./EmojiPicker.css";
import emojiKeywords from "./emojiKeywords.json";

const emojis = [...new Set(`
🏆 🥇 🥈 🥉 🏅 🎖️ ⭐ 🌟 💫 ✨ 💎 👑 🎯 🔥 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 🩷 🩵 🩶 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝
😀 😃 😄 😁 😆 😅 😂 🤣 🥲 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🫡 🤭 🫢 🫣 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🫠 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾
👋 🤚 🖐️ ✋ 🖖 🫶 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 💪 🦾 🧠 🫀 🫁 👀 👁️ 👅 👄 👶 🧒 👦 👧 🧑 👨 👩 🧓 👴 👵 🧙 🧚 🧛 🧜 🧝 🧞 🧟 🦸 🦹 🧑‍🚀 🧑‍🎨 🧑‍🔬 🧑‍💻
🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🐤 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪲 🐛 🦋 🐌 🐞 🐜 🪰 🪱 🦗 🕷️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🦭 🐊 🐅 🐆 🦓 🦍 🦧 🦣 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🦬 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🐈 🪶 🦚 🦜 🦢 🦩 🕊️ 🐇 🦝 🦨 🦡 🦫 🦦 🦥 🐁 🐀 🐿️ 🦔 🐾 🐉 🐲
🌵 🎄 🌲 🌳 🌴 🪵 🌱 🌿 ☘️ 🍀 🎍 🪴 🎋 🍃 🍂 🍁 🍄 🐚 🪸 🪨 🌾 💐 🌷 🌹 🥀 🪻 🪷 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔 🌙 🌎 🌍 🌏 🪐 💥 ☄️ ☀️ 🌤️ ⛅ 🌥️ ☁️ 🌦️ 🌧️ ⛈️ 🌩️ 🌨️ ❄️ ☃️ ⛄ 🌬️ 💨 🌪️ 🌫️ 🌈 ☔ ⚡ 💧 💦 🌊
🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶️ 🫑 🌽 🥕 🫒 🧄 🧅 🥔 🍠 🫘 🥐 🥯 🍞 🥖 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🌭 🍔 🍟 🍕 🫓 🥪 🌮 🌯 🫔 🥙 🧆 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 ☕ 🍵 🧃 🥤 🧋 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🍾 🧊
⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🏸 🏒 🏑 🥍 🏏 🪃 🥅 ⛳ 🪁 🏹 🎣 🤿 🥊 🥋 🎽 🛹 🛼 🛷 ⛸️ 🥌 🎿 ⛷️ 🏂 🪂 🏋️ 🤼 🤸 ⛹️ 🤺 🤾 🏌️ 🏇 🧘 🏄 🏊 🤽 🚣 🧗 🚵 🚴 🎪 🎭 🩰 🎨 🎬 🎤 🎧 🎼 🎹 🥁 🪘 🎷 🎺 🪗 🎸 🪕 🎻 🎲 ♟️ 🎮 🕹️ 🧩 🎰 🎳
🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🛵 🏍️ 🚲 🛴 🛺 🚂 🚆 🚇 🚊 🚉 ✈️ 🛫 🛬 🛩️ 🚀 🛸 🚁 🛶 ⛵ 🚤 🛥️ 🛳️ ⛴️ 🚢 ⚓ 🛟 ⛽ 🚦 🗺️ 🗿 🗽 🗼 🏰 🏯 🏟️ 🎡 🎢 🎠 ⛲ ⛱️ 🏖️ 🏝️ 🏜️ 🌋 ⛰️ 🏔️ 🗻 🏕️ ⛺ 🏠 🏡 🏢 🏥 🏦 🏨 🏫 🏛️ ⛪ 🕌 🛕 🕍 🌅 🌄 🌠 🎇 🎆 🌃 🌆 🌇 🌉
⌚ 📱 💻 ⌨️ 🖥️ 🖨️ 🖱️ 💽 💾 💿 📀 📷 📸 📹 🎥 📽️ 📞 ☎️ 📺 📻 🎙️ ⏱️ ⏰ ⌛ ⏳ 📡 🔋 🔌 💡 🔦 🕯️ 🧯 🛢️ 💸 💵 💴 💶 💷 🪙 💰 💳 🧾 ✉️ 📧 📦 📫 📬 📮 📝 📁 📂 🗂️ 📅 📆 🗒️ 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🖊️ 🖋️ ✒️ 🖌️ 🖍️ ✏️ 📚 📖 🔖 🏷️ 🔒 🔓 🔑 🗝️ 🔨 🪓 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🛡️ 🔧 🪛 🔩 ⚙️ 🗜️ ⚖️ 🦯 🔗 ⛓️ 🪝 🧰 🧲 🪜 🧪 🧫 🧬 🔬 🔭 💉 💊 🩹 🩺 🩻 🧹 🧺 🧻 🧼 🪥 🧽 🪣 🛒 🎁 🎈 🎀 🎊 🎉 🪄 🪅 🪆 🧸
✅ ☑️ ✔️ ❌ ❎ ➕ ➖ ➗ ✖️ ♾️ ❓ ❔ ❕ ❗ ‼️ ⁉️ 💯 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ 🟤 🔺 🔻 🔶 🔷 🔸 🔹 🔳 🔲 🟥 🟧 🟨 🟩 🟦 🟪 ⬛ ⬜ 🟫 🔈 🔉 🔊 🔇 🔔 🔕 📣 📢 💬 💭 🗯️ ♠️ ♣️ ♥️ ♦️ 🃏 🀄 🎴 🔞 🚫 ⛔ ⚠️ 🚸 ♻️ 🌐 💤 🌀 🆕 🆓 🆒 🆗 🆙 🆘 🏁 🚩 🎌 🏳️ 🏴 🏳️‍🌈 🏳️‍⚧️
`.trim().split(/\s+/))];

interface EmojiPickerProps {
  value?: string;
  tagName: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, tagName, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const keywords: Record<string, string> = emojiKeywords;
  const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = emojis.filter((emoji) => searchTerms.every((term) =>
    `${emoji} ${keywords[emoji] ?? ""}`.includes(term)
  ));
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function select(emoji: string) {
    onChange(emoji);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div className="emoji-picker" ref={container} onKeyDown={(event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button ref={trigger} type="button" aria-label={`Choose emoji for ${tagName}`} aria-expanded={open} onClick={() => { setQuery(""); setOpen(!open); }}>
        {value || "＋"}
      </button>
      {open && (
        <div className="emoji-picker-popup" role="group" aria-label={`Emoji for ${tagName}`}>
          <input
            autoFocus
            className="emoji-picker-search"
            type="search"
            aria-label="Search emojis"
            placeholder="Search emojis…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className="emoji-picker-clear" onClick={() => select("")}>No emoji</button>
          {matches.length === 0 && <p role="status">No matching emojis.</p>}
          <div className="emoji-picker-grid">
            {matches.map((emoji) => (
              <button key={emoji} type="button" aria-label={keywords[emoji] || emoji} aria-pressed={value === emoji} onClick={() => select(emoji)}>{emoji}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
