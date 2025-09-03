import React, { useState, useContext, useEffect, useRef } from "react";
import {
    deleteActivity,
    updateActivity,
    addReaction,
    removeReaction,
    addComment,
    deleteComment,
    updateComment,
} from "../../api/activity/activityApi";
import { AuthContext } from "../../context/AuthContext";
import {
    FaThumbsUp,
    FaComment,
    FaShare,
    FaEllipsisH,
    FaTimes,
    FaEdit,
    FaTrash,
    FaSmile,
} from "react-icons/fa";
import EmojiPicker from "../../components/EmojiPicker.jsx";
import Loader from "../../components/common/Loader";
import "../../styles/ActivityCard.css";
import clsx from "clsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") return null;
    if (imagePath.startsWith("http")) return imagePath;
    // Fix for missing slash in path
    return `${API_BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
};

const getInitials = (name) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const Comment = ({
    comment,
    activityId,
    currentUser,
    userRole,
    onCommentUpdate,
    onShowNotification,
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [editText, setEditText] = useState(comment.comment);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const deleteTimerRef = useRef(null);
    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const permanentDelete = async (itemId) => {
        try {
            setLoading(true);
            await deleteComment(activityId, itemId, currentUser.username);
            onCommentUpdate();
            onShowNotification("Comment deleted successfully!", "success");
        } catch (error) {
            console.error("Permanent Delete Comment Error:", error);
            onShowNotification("Failed to permanently delete comment.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = () => {
        if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
        }
        onShowNotification("Deletion canceled.", "info");
    };

    const handleDelete = () => {
        if (userRole !== "ADMIN" && comment.username !== currentUser?.username) {
            onShowNotification("You can only delete your own comments.", "warning");
            return;
        }

        onShowNotification(
            "Comment will be deleted in 5 seconds.",
            "warning",
            true,
            () => handleUndo(comment.id),
            5000
        );
        deleteTimerRef.current = setTimeout(() => permanentDelete(comment.id), 5000);
        setShowOptions(false);
    };

    const handleEdit = async () => {
        if (!editText.trim()) {
            onShowNotification("Comment cannot be empty.", "warning");
            return;
        }
        try {
            setLoading(true);
            await updateComment(
                activityId,
                comment.id,
                currentUser.username,
                editText
            );
            setIsEditing(false);
            onCommentUpdate();
            setShowOptions(false);
            onShowNotification("Comment updated successfully!", "success");
        } catch (error) {
            console.error("Update Comment Error:", error);
            onShowNotification("Failed to update comment.", "error");
        } finally {
            setLoading(false);
        }
    };
    const handleReply = async () => {
        if (!replyText.trim()) {
            onShowNotification("Reply cannot be empty.", "warning");
            return;
        }
        try {
            setLoading(true);
            await addComment(activityId, currentUser.username, replyText, comment.id);
            setReplyText("");
            setIsReplying(false);
            onCommentUpdate();
            onShowNotification("Reply added successfully!", "success");
        } catch (error) {
            console.error("Add Reply Error:", error);
            onShowNotification("Failed to add reply.", "error");
        } finally {
            setLoading(false);
        }
    };

    const canEditDelete = userRole === "ADMIN" || comment.username === currentUser?.username;

    return (
        <div className="comment">
            {loading && <Loader text="Processing..." />}
            <div className="comment-content">
                <div className="comment-avatar-placeholder">
                    {getInitials(comment.username)}
                </div>
                <div className="comment-text-bubble">
                    <div className="comment-header">
                        <span className="comment-username">{comment.username}</span>
                        {canEditDelete && (
                            <div className="comment-options" ref={optionsRef}>
                                <button className="options-btn" onClick={() => setShowOptions(!showOptions)}>
                                    <FaEllipsisH size={12} />
                                </button>
                                {showOptions && (
                                    <div className="comment-options-menu">
                                        <button onClick={() => { setIsEditing(true); setShowOptions(false); }}>
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button onClick={handleDelete}>
                                            <FaTrash size={12} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="edit-comment-form">
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                autoFocus
                            />
                            <div className="edit-comment-actions">
                                <button className="btn-green" onClick={handleEdit}>
                                    Save
                                </button>
                                <button className="btn-red" onClick={() => { setIsEditing(false); setEditText(comment.comment); }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p>{comment.comment}</p>
                            <div className="comment-actions-footer">
                                <button className="comment-action-btn">Like</button>
                                <span>·</span>
                                <button className="comment-action-btn" onClick={() => setIsReplying(!isReplying)}>
                                    Reply
                                </button>
                                <span>·</span>
                                <span className="comment-time">
                                    {new Date(comment.commentedAt || comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isReplying && (
                <div className="reply-form">
                    <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                    />
                    <div className="reply-actions">
                        <button className="btn-green" onClick={handleReply}>
                            Reply
                        </button>
                        <button className="btn-red" onClick={() => setIsReplying(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div className="replies-container">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            activityId={activityId}
                            currentUser={currentUser}
                            userRole={userRole}
                            onCommentUpdate={onCommentUpdate}
                            onShowNotification={onShowNotification}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ActivityCard = ({ activity, fetchActivities, onShowNotification }) => {
    const { role, user } = useContext(AuthContext);
    const [commentForm, setCommentForm] = useState("");
    const [userReaction, setUserReaction] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        activityName: activity.activityName,
        description: activity.description,
        imagePath: activity.imagePath,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const deleteTimerRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const optionsRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const commentInputRef = useRef(null);

    useEffect(() => {
        if (user && activity.reactions) {
            const userReaction = activity.reactions.find((reaction) => reaction.username === user.username);
            setUserReaction(userReaction?.reactionType || null);
        }
    }, [activity, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const permanentDelete = async (itemId) => {
        try {
            setLoading(true);
            await deleteActivity(itemId);
            fetchActivities();
            onShowNotification("Activity deleted successfully!", "success");
        } catch (error) {
            console.error("Permanent Delete Activity Error:", error);
            onShowNotification("Failed to permanently delete activity.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = () => {
        if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
        }
        onShowNotification("Deletion canceled.", "info");
    };

    const handleDelete = (id) => {
        if (role !== "ADMIN") {
            onShowNotification("Only administrators can delete activities.", "warning");
            return;
        }
        
        onShowNotification(
            "Activity will be deleted in 5 seconds.",
            "warning",
            true,
            handleUndo,
            5000
        );
        deleteTimerRef.current = setTimeout(() => permanentDelete(id), 5000);
        setShowOptions(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setEditForm({ ...editForm, imagePath: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpdate = async () => {
        if (!editForm.activityName || !editForm.description) {
            onShowNotification("All fields are required.", "warning");
            return;
        }

        try {
            setIsUploading(true);
            setLoading(true);
            const updated = await updateActivity(activity.id, editForm, imageFile);

            if (updated) {
                setIsEditing(false);
                setImageFile(null);
                setImagePreview(null);
                fetchActivities();
                onShowNotification("Activity updated successfully!", "success");
            } else {
                onShowNotification("Update failed.", "error");
            }
        } catch (error) {
            console.error("Update Activity Error:", error);
            onShowNotification("Failed to update activity.", "error");
        } finally {
            setIsUploading(false);
            setLoading(false);
        }
    };

    const handleReaction = async (id, reactionType) => {
        if (!user || !user.username) {
            onShowNotification("Please log in to react.", "warning");
            return;
        }

        try {
            setLoading(true);
            if (userReaction === reactionType) {
                setUserReaction(null);
                await removeReaction(id, user.username);
                onShowNotification("Reaction removed!", "success");
            } else {
                setUserReaction(reactionType);
                await addReaction(id, user.username, reactionType);
                onShowNotification("Reaction added!", "success");
            }
            fetchActivities();
        } catch (error) {
            console.error("Reaction Error:", error);
            setUserReaction(
                activity.reactions.find((r) => r.username === user.username)?.reactionType || null
            );
            onShowNotification("Failed to add reaction.", "error");
        } finally {
            setLoading(false);
        }
        setShowEmojiPicker(false);
    };

    const handleQuickLike = async (id) => {
        if (!user || !user.username) {
            onShowNotification("Please log in to like.", "warning");
            return;
        }
        try {
            setLoading(true);
            if (userReaction === "👍") {
                setUserReaction(null);
                await removeReaction(id, user.username);
                onShowNotification("Like removed!", "success");
            } else {
                setUserReaction("👍");
                await addReaction(id, user.username, "👍");
                onShowNotification("Liked!", "success");
            }
            fetchActivities();
        } catch (error) {
            console.error("Like Error:", error);
            onShowNotification("Failed to like.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (activityId) => {
        if (!commentForm.trim()) {
            onShowNotification("Comment cannot be empty.", "warning");
            return;
        }
        if (!user || !user.username) {
            onShowNotification("Please log in to comment.", "warning");
            return;
        }
        try {
            setLoading(true);
            await addComment(activityId, user.username, commentForm);
            setCommentForm("");
            fetchActivities();
            onShowNotification("Comment added successfully!", "success");
            setCommentsVisible(true);
        } catch (error) {
            console.error("Add Comment Error:", error);
            onShowNotification("Failed to add comment.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleMouseDown = () => {
        holdTimeoutRef.current = setTimeout(() => {
            setShowEmojiPicker(true);
        }, 500);
    };

    const handleMouseUp = () => {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };

    const toggleComments = () => {
        setCommentsVisible(!commentsVisible);
        if (!commentsVisible && commentInputRef.current) {
            setTimeout(() => {
                commentInputRef.current.focus();
            }, 100);
        }
    };

    const getReactionSummary = () => {
        const reactionCount = activity.totalLikes || 0;
        if (reactionCount === 0) {
            return (
                <div className="reactions-summary">
                    <span>0 Reactions</span>
                </div>
            );
        }
        const reactionCounts = {};
        if (activity.reactions) {
            activity.reactions.forEach((reaction) => {
                reactionCounts[reaction.reactionType] = (reactionCounts[reaction.reactionType] || 0) + 1;
            });
        }
        const topReactions = Object.entries(reactionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([emoji]) => emoji);

        return (
            <div className="reactions-summary">
                <div className="reaction-icons">
                    {topReactions.map((emoji, index) => (
                        <span key={index} className="summary-emoji">
                            {emoji}
                        </span>
                    ))}
                </div>
                <span>{reactionCount} Reactions</span>
            </div>
        );
    };

    const renderCommentForm = () => (
        <div className="comment-input-container">
            <div className="comment-input-wrapper">
                <input
                    ref={commentInputRef}
                    type="text"
                    placeholder="Write a comment..."
                    value={commentForm}
                    onChange={(e) => setCommentForm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleCommentSubmit(activity.id);
                        }
                    }}
                />
                <button
                    className="emoji-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <FaSmile />
                </button>
                {showEmojiPicker && (
                    <div className="emoji-picker-container" ref={emojiPickerRef}>
                        <EmojiPicker
                            onSelect={(emoji) => {
                                setCommentForm((prev) => prev + emoji);
                                setShowEmojiPicker(false);
                            }}
                        />
                    </div>
                )}
            </div>
            <button
                className="btn-green"
                onClick={() => handleCommentSubmit(activity.id)}
                disabled={!commentForm.trim()}
            >
                Comment
            </button>
        </div>
    );

    const getTopLevelComments = (comments) => {
        if (!comments) return [];
        return comments.filter((comment) => !comment.parentId);
    };

    return (
        <div className="activity-card" key={activity.id}>
            {loading && <Loader text="Processing..." />}

            <div className="card-header">
                <div className="card-author-info">
                    <div className="author-avatar-placeholder">
                        {getInitials(activity.createdBy)}
                    </div>
                    <div className="author-details">
                        {/* <span className="author-name">{activity.createdBy || "Admin"}</span> */}
                        <span className="author-name"> {activity.createdByName || localStorage.getItem("userName") || "Admin"} </span>
                        <span className="activity-date">
                            {new Date(activity.activityDate).toLocaleDateString()} at{" "}
                            {new Date(activity.activityDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>
                <div className="card-options" ref={optionsRef}>
                    <button
                        className="options-btn"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <FaEllipsisH />
                    </button>
                    {showOptions && (
                        <div className="options-menu">
                            {role === "ADMIN" && (
                                <>
                                    <button onClick={() => setIsEditing(true)}>
                                        <FaEdit size={12} /> Update
                                    </button>
                                    <button onClick={() => handleDelete(activity.id)}>
                                        <FaTrash size={12} /> Delete
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() =>
                                    onShowNotification("Report feature coming soon", "info")
                                }
                            >
                                Report
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editForm.activityName}
                        onChange={(e) =>
                            setEditForm({ ...editForm, activityName: e.target.value })
                        }
                        placeholder="Activity Name"
                    />
                    <textarea
                        value={editForm.description}
                        onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                        }
                        placeholder="Activity Description"
                    />
                    <div className="image-upload-section">
                        <h4>Activity Image</h4>
                        {(editForm.imagePath || imagePreview) && (
                            <div className="current-image-preview">
                                <img
                                    src={imagePreview || getImageUrl(editForm.imagePath)}
                                    alt="Preview"
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={removeImage}
                                >
                                    <FaTimes /> Remove Image
                                </button>
                            </div>
                        )}
                        <div className="file-input-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="file-input"
                                id={`image-upload-${activity.id}`}
                            />
                            <label
                                htmlFor={`image-upload-${activity.id}`}
                                className="file-input-label"
                            >
                                Choose New Image
                            </label>
                        </div>
                    </div>
                    <div className="edit-form-buttons">
                        <button
                            className="btn-green"
                            onClick={handleUpdate}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Save Changes"}
                        </button>
                        <button
                            className="btn-red"
                            onClick={() => {
                                setIsEditing(false);
                                setImageFile(null);
                                setImagePreview(null);
                            }}
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="activity-title">{activity.activityName}</h3>
                    <p className="card-description">{activity.description}</p>
                    {activity.imagePath && (
                        <div className="card-image-container">
                            <img
                                src={getImageUrl(activity.imagePath)}
                                alt={activity.activityName}
                                className="card-image"
                            />
                        </div>
                    )}
                    <div className="post-stats">
                        {getReactionSummary()}
                        <div className="comments-summary clickable" onClick={toggleComments}>
                            <span>{activity.comments?.length || 0} Comments</span>
                            <span>{activity.shares || 0} Shares</span>
                        </div>
                    </div>
                    <div className="action-buttons-container">
                        <div className="reaction-wrapper" onMouseLeave={() => { clearTimeout(holdTimeoutRef.current); setShowEmojiPicker(false); }}>
                            <button
                                className={clsx("action-btn like-btn", { reacted: !!userReaction })}
                                onClick={() => handleQuickLike(activity.id)}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                            >
                                {userReaction ? (
                                    <span className="reaction-emoji">{userReaction}</span>
                                ) : (
                                    <FaThumbsUp />
                                )}
                                <span>Like</span>
                            </button>
                            {showEmojiPicker && (
                                <div className="emoji-picker-container" ref={emojiPickerRef}>
                                    <EmojiPicker onSelect={(emoji) => handleReaction(activity.id, emoji)} />
                                </div>
                            )}
                        </div>
                        <button className="action-btn" onClick={toggleComments}>
                            <FaComment />
                            <span>Comment</span>
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => onShowNotification("Share feature not implemented.", "info")}
                        >
                            <FaShare />
                            <span>Share</span>
                        </button>
                    </div>
                    {commentsVisible && (
                        <div className="comments-section">
                            <div className="comment-list-container">
                                {activity.comments && activity.comments.length > 0 ? (
                                    getTopLevelComments(activity.comments).map((comment) => (
                                        <Comment
                                            key={comment.id}
                                            comment={comment}
                                            activityId={activity.id}
                                            currentUser={user}
                                            userRole={role}
                                            onCommentUpdate={fetchActivities}
                                            onShowNotification={onShowNotification}
                                        />
                                    ))
                                ) : (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                )}
                            </div>
                            {renderCommentForm()}
                        </div>
                    )}
                </>
            )}
            {role === "ADMIN" && !isEditing && (
                <div className="admin-actions">
                    <button
                        className="btn-edit"
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit /> Edit Activity
                    </button>
                    <button
                        className="btn-delete"
                        onClick={() => handleDelete(activity.id)}
                    >
                        <FaTrash /> Delete Activity
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityCard;