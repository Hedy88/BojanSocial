const fetchPost = async (postId, signal) => {
  const response = await fetch(`/api/v1/client/get_post/${postId}`, { signal });

  if (!response.ok) {
    throw new Error("couldn't fetch post from the server :(");
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.post;
};

const fetchPostCatagory = async (feed, page, signal) => {
  const response = await fetch(`/api/v1/client/get_${feed}_posts?page=${page}`, { signal, credentials: "same-origin" });

  if (!response.ok) {
    throw new Error("couldn't fetch posts from the server :(");
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return { posts: data.posts, pages: data.pages };
};

export { fetchPost, fetchPostCatagory };
