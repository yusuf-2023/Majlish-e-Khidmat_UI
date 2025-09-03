import API from "../core/httpClient";

// Fetching all activities
export const getActivities = async () => {
    try {
        const response = await API.get("/activities/all");
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching activities:", error.response?.data || error.message);
        return { data: [] };
    }
};

// Alias for backward compatibility
export const getAllActivities = getActivities;

// Adding an activity
export const addActivity = async (formData) => {
    try {
        const response = await API.post("/activities/create", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding activity:", error.response?.data || error.message);
        return null;
    }
};

// Deleting an activity
export const deleteActivity = async (id) => {
    try {
        await API.delete(`/activities/delete/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting activity:", error.response?.data || error.message);
        return false;
    }
};

// Updating an activity
export const updateActivity = async (id, activityData, imageFile = null) => {
    try {
        const payload = new FormData();
        Object.keys(activityData).forEach(key => {
            payload.append(key, activityData[key]);
        });
        if (imageFile) {
            payload.append("imageFile", imageFile);
        }

        const response = await API.put(
            `/activities/update/${id}`,
            payload,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating activity:", error.response?.data || error.message);
        return null;
    }
};

// Upload activity image separately
export const uploadActivityImage = async (id, formData) => {
    try {
        const response = await API.post(
            `/activities/upload/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading activity image:", error.response?.data || error.message);
        return null;
    }
};

// Reactions
export const addReaction = async (id, username, reactionType) => {
    try {
        const response = await API.post(`/activities/react/${id}?username=${username}&reactionType=${reactionType}`);
        return response.data;
    } catch (error) {
        console.error("Error adding reaction:", error.response?.data || error.message);
        return null;
    }
};

export const removeReaction = async (id, username) => {
    try {
        const response = await API.delete(`/activities/react/${id}?username=${username}`);
        return false;
    } catch (error) {
        console.error("Error removing reaction:", error.response?.data || error.message);
        return null;
    }
};

// Comments
export const addComment = async (id, username, comment) => {
    try {
        const response = await API.post(`/activities/comment/${id}?username=${username}&comment=${comment}`);
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error.response?.data || error.message);
        return null;
    }
};

export const deleteComment = async (activityId, commentId, username) => {
    try {
        await API.delete(`/activities/comment/${activityId}/${commentId}?username=${username}`);
        return true;
    } catch (error) {
        console.error("Error deleting comment:", error.response?.data || error.message);
        return false;
    }
};

// FIXED: Update comment function
export const updateComment = async (activityId, commentId, username, newComment) => {
    try {
        const response = await API.put(
            `/activities/comment/${activityId}/${commentId}?username=${encodeURIComponent(username)}&comment=${encodeURIComponent(newComment)}`
        );
        return response.data;
    } catch (error) {
        console.error("Error updating comment:", error.response?.data || error.message);
        return null;
    }
};

// Replies
export const addReply = async (activityId, commentId, username, reply) => {
    try {
        const response = await API.post(
            `/activities/reply/${activityId}/${commentId}?username=${username}&reply=${reply}`
        );
        return response.data;
    } catch (error) {
        console.error("Error adding reply:", error.response?.data || error.message);
        return null;
    }
};

export const deleteReply = async (activityId, commentId, replyId, username) => {
    try {
        await API.delete(`/activities/reply/${activityId}/${commentId}/${replyId}?username=${username}`);
        return true;
    } catch (error) {
        console.error("Error deleting reply:", error.response?.data || error.message);
        return false;
    }
};

// FIXED: Update reply function
export const updateReply = async (activityId, commentId, replyId, username, newReply) => {
    try {
        const response = await API.put(
            `/activities/reply/${activityId}/${commentId}/${replyId}?username=${encodeURIComponent(username)}&reply=${encodeURIComponent(newReply)}`
        );
        return response.data;
    } catch (error) {
        console.error("Error updating reply:", error.response?.data || error.message);
        return null;
    }
};