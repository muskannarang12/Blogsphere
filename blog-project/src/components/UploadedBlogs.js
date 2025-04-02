import React, { useEffect, useState } from 'react';

const UploadedBlogs = ({ isDarkMode }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    setMessage("Please log in to view your blogs.");
                    setLoading(false);
                    return;
                }

                console.log("Sending Token:", token); // Debugging

                const response = await fetch("http://localhost:5000/api/my-blogs", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Response Status:", response.status); // Debugging

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error: ${errorData.error}`);
                }

                const data = await response.json();
                console.log("Fetched Blogs:", data);

                if (data.length === 0) {
                    setMessage("You have not uploaded any blogs yet.");
                } else {
                    setBlogs(data);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setMessage("Failed to fetch blogs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserBlogs();
    }, []);

    return (
        <div className={`container my-5 ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <h2 className="text-center">My Uploaded Blogs</h2>

            {loading ? (
                <p>Loading...</p>
            ) : message ? (
                <div className="text-center">
                    <p>{message}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.href = '/create-blog'}
                    >
                        Create Blog
                    </button>
                </div>
            ) : (
                <div className="row">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="col-md-4">
                            <div className={`card mb-4 ${isDarkMode ? 'bg-secondary text-light' : ''}`}>
                                <img src={blog.coverImage} className="card-img-top" alt={blog.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <p className="card-text">{blog.description}</p>
                                    <a href={`/blog/${blog._id}`} className="btn btn-primary">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadedBlogs;