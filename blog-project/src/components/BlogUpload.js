import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import
import axios from "axios";
const BlogUpload = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [technology, setTechnology] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newTags = value.split(',').map((tag) => tag.trim());
      setTags(newTags);
    } else {
      setTags([value.trim()]);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const blogs = [
    {
      title: "Mastering React Components",
      description: "A deep dive into React components and their lifecycle.",
      content: "React components are the building blocks of any React application. Understanding their lifecycle methods, such as componentDidMount and componentWillUnmount, is crucial for building efficient and scalable applications. This blog explores best practices for managing state and props in React components.",
      technology: "React",
      tags: ["React", "JavaScript", "Frontend"],
      readingTime: 5,
      authorName: "John Doe",
      isFeatured: true,
      coverImage: "/assets/react.png",
    },
    {
      title: "Python for Data Analysis",
      description: "Learn how to use Python for data analysis and visualization.",
      content: "Python is a powerful language for data analysis, thanks to libraries like Pandas, NumPy, and Matplotlib. This blog walks you through the basics of data manipulation, cleaning, and visualization using Python. Whether you're a beginner or an experienced developer, you'll find useful tips and tricks here.",
      technology: "Python",
      tags: ["Python", "Data Analysis", "Beginner"],
      readingTime: 7,
      authorName: "Jane Smith",
      isFeatured: false,
      coverImage: "/assets/python.jpg",
    },
    {
      title: "Advanced JavaScript Techniques",
      description: "Explore advanced JavaScript concepts like closures and promises.",
      content: "JavaScript is a versatile language with many advanced features. This blog covers closures, promises, async/await, and other modern JavaScript techniques. By the end of this blog, you'll have a deeper understanding of how to write efficient and maintainable JavaScript code.",
      technology: "JavaScript",
      tags: ["JavaScript", "Web Development", "Advanced"],
      readingTime: 10,
      authorName: "Alex Johnson",
      isFeatured: true,
      coverImage: "/assets/js.jpg",
    },
    {
      title: "Introduction to Machine Learning",
      description: "A beginner's guide to understanding machine learning concepts.",
      content: "Machine learning is transforming industries by enabling computers to learn from data. This blog introduces the basic concepts of machine learning, including supervised and unsupervised learning, and provides examples of real-world applications. Perfect for those new to the field.",
      technology: "Data Science",
      tags: ["Data Science", "Machine Learning", "Python"],
      readingTime: 8,
      authorName: "Sarah Lee",
      isFeatured: false,
      coverImage: "/assets/datascience.jpg",
    },
    {
      title: "Building Neural Networks",
      description: "Learn how to build and train neural networks from scratch.",
      content: "Neural networks are at the heart of modern AI. This blog explains the fundamentals of neural networks, including layers, activation functions, and backpropagation. You'll also learn how to implement a simple neural network using Python and TensorFlow.",
      technology: "Machine Learning",
      tags: ["Machine Learning", "AI", "Python"],
      readingTime: 9,
      authorName: "Michael Brown",
      isFeatured: true,
      coverImage: "/assets/gen2.png",
    },
  //   {
  //     title: "Node.js for Backend Development",
  //     description: "A comprehensive guide to building backend systems with Node.js.",
  //     content: "Node.js is a popular choice for building scalable backend systems. This blog covers the basics of Node.js, including event-driven architecture, the Node Package Manager (NPM), and building RESTful APIs. You'll also learn how to deploy Node.js applications to the cloud.",
  //     technology: "Web Development",
  //     tags: ["Node.js", "JavaScript", "Backend"],
  //     readingTime: 6,
  //     authorName: "Emily Davis",
  //     isFeatured: false,
  //     coverImage: "/assets/web.jpg",
  //   },
  //   {
  //     title: "Cross-Platform Apps with React Native",
  //     description: "Build mobile apps for iOS and Android using React Native.",
  //     content: "React Native allows developers to build cross-platform mobile apps using JavaScript. This blog explores the core concepts of React Native, including components, navigation, and state management. You'll also learn how to debug and optimize React Native apps.",
  //     technology: "Mobile Development",
  //     tags: ["React Native", "Mobile", "JavaScript"],
  //     readingTime: 7,
  //     authorName: "David Wilson",
  //     isFeatured: true,
  //     coverImage: "/assets/mobile.jpg",
  //   },
  //   {
  //     title: "Getting Started with AWS",
  //     description: "An introduction to Amazon Web Services for beginners.",
  //     content: "AWS is a leading cloud computing platform that offers a wide range of services. This blog provides an overview of AWS, including EC2, S3, and Lambda. You'll learn how to set up your first AWS account and deploy a simple application.",
  //     technology: "Cloud Computing",
  //     tags: ["AWS", "Cloud", "DevOps"],
  //     readingTime: 8,
  //     authorName: "Olivia Green",
  //     isFeatured: false,
  //     coverImage: "/assets/cloud.jpg",
  //   },
  //   {
  //     title: "CI/CD Pipelines with Jenkins",
  //     description: "Learn how to automate your development workflow with Jenkins.",
  //     content: "Continuous Integration and Continuous Deployment (CI/CD) are essential for modern software development. This blog explains how to set up a CI/CD pipeline using Jenkins. You'll also learn best practices for automating testing and deployment.",
  //     technology: "DevOps",
  //     tags: ["DevOps", "CI/CD", "Automation"],
  //     readingTime: 6,
  //     authorName: "Daniel Harris",
  //     isFeatured: true,
  //     coverImage: "/assets/dev.jpg",
  //   },
  //   {
  //     title: "Understanding Blockchain Technology",
  //     description: "A beginner's guide to blockchain and its applications.",
  //     content: "Blockchain is a revolutionary technology that powers cryptocurrencies like Bitcoin and Ethereum. This blog explains the basics of blockchain, including distributed ledgers, consensus algorithms, and smart contracts. You'll also learn about real-world use cases for blockchain.",
  //     technology: "Blockchain",
  //     tags: ["Blockchain", "Cryptocurrency", "Decentralization"],
  //     readingTime: 7,
  //     authorName: "Sophia Martinez",
  //     isFeatured: false,
  //     coverImage: "/assets/blockchain.jpg",
  //   },
  ];
  
  // Post blogs to the backend
  // blogs.forEach(async (blog) => {
  //   await axios.post("http://localhost:5000/api/blogs", blog, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   });
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token); // Debug
  
    if (!token) {
      alert('You are not logged in. Please log in to create a blog.');
      navigate('/login');
      return;
    }
  
    try {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token); // Use jwtDecode to decode the token
      console.log("Decoded Token:", decodedToken);

      const userId = decodedToken.userId; // Ensure this matches the field in your token
  
      if (!userId) {
        throw new Error('User ID not found in token.');
      }
  
      const blogData = {
        title,
        description,
        content,
        tags,
        coverImage,
        technology,
        readingTime,
        authorName: authorName || "Anonymous", // Set a default value if authorName is empty
        isFeatured,
        user: userId, // Include the user ID in the blog data
      };
  
      console.log('Blog Data:', blogData);
  
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Invalid token.') {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error(errorData.error || 'Failed to save blog. Please try again.');
      }
  
      alert('Blog created successfully!');
      navigate('/uploaded-blogs');
    } catch (error) {
      console.error('Error:', error);
      if (error.message === 'Failed to fetch') {
        alert('Network error. Please check your internet connection.');
      } else {
        alert(error.message || 'Failed to save blog. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Predefined list of technologies/categories
  const technologyOptions = [
    'React',
    'Python',
    'JavaScript',
    'Data Science',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'DevOps',
    'Blockchain',
  ];

  return (
    <div
      className={`container my-5 ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      style={{ maxWidth: '800px', borderRadius: '10px', padding: '20px' }}
    >
      <h1
        className="text-center mb-4"
        style={{ color: '#6C63FF', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
      >
        Create a New Blog
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your blog"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description of your blog"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            required
          />
        </div>

        {/* Technology/Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="technology" className="form-label">Technology/Category</label>
          <select
            className={`form-select ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="technology"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            required
          >
            <option value="">Select a technology or category</option>
            {technologyOptions.map((tech, index) => (
              <option key={index} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input
            type="text"
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="tags"
            onChange={handleTagChange}
            placeholder="Enter tags separated by commas (e.g., technology, science, programming)"
          />
          <small className="text-muted">Tags help readers find your blog.</small>
        </div>

        {/* Cover Image */}
        <div className="mb-4">
          <label htmlFor="coverImage" className="form-label">Cover Image</label>
          <input
            type="file"
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="coverImage"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          {coverImage && (
            <div className="mt-3">
              <img
                src={coverImage}
                alt="Cover Preview"
                style={{ maxWidth: '100%', borderRadius: '10px' }}
              />
            </div>
          )}
        </div>

        {/* Reading Time */}
        <div className="mb-4">
          <label htmlFor="readingTime" className="form-label">Reading Time (in minutes)</label>
          <input
            type="number"
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="readingTime"
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            placeholder="Enter estimated reading time"
          />
        </div>

        {/* Author Name */}
        <div className="mb-4">
          <label htmlFor="authorName" className="form-label">Author Name (Optional)</label>
          <input
            type="text"
            className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter the author's name"
          />
        </div>

        {/* Featured Checkbox */}
        <div className="mb-4 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isFeatured">
            Mark this blog as featured
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ backgroundColor: '#6C63FF', border: 'none', padding: '10px 20px' }}
          >
            {isLoading ? 'Uploading...' : 'Publish Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogUpload;