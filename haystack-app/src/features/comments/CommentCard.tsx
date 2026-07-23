import { useState } from 'react';
import type { Action } from '../../state/state';
import type { Video } from '../../state/types';
import './CommentCard.css';
import '../ui/styles/LinedPaper.scss'

interface CommentCardProps {
  onClose: () => void;
  video: Video;
  dispatch: React.ActionDispatch<[action: Action]>;
  comment?: string;
};

export function CommentCard(props: CommentCardProps) {

    const [commentText, setCommentText] = useState(props.comment || "");

    function saveComment(comment: string) {
        props.dispatch({
            type: "SET_COMMENT",
            creatorId: props.video.creatorId_yt,
            videoId: props.video.videoId_yt,
            comment: comment,
        });

        props.onClose();
    }

  return (
    <div className="comment-card lined-paper">
        <h3 className="comment-card-title">
            Add a comment
        </h3>

        <textarea
        className="comment-textarea"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="What do you think about this video?"
        />

        <div className="comment-card-buttons">
            <button className="comment-white-button" onClick={props.onClose}>
            Close
            </button>

            <button className="comment-white-button" onClick={() => setCommentText(props.comment || "")}>
            Undo
            </button>

            <button className="comment-emphasis-button" onClick={() => saveComment(commentText)}>
            Save
            </button>
        </div>
    </div>
  );
}