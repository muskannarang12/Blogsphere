import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const Search = ({ blogs, onFilter, isDarkMode }) => {
  const [query, setQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const now = new Date();
    const filtered = blogs.filter((blog) => {
      const blogDate = new Date(blog.createdAt);
      const timeDiff = now - blogDate;

      let timeCondition = true;
      switch (timeFilter) {
        case "recent":
          timeCondition = timeDiff <= 7 * 24 * 60 * 60 * 1000;
          break;
        case "1month":
          timeCondition = timeDiff <= 30 * 24 * 60 * 60 * 1000;
          break;
        case "1year":
          timeCondition = timeDiff <= 365 * 24 * 60 * 60 * 1000;
          break;
        default:
          timeCondition = true;
      }

      const searchCondition =
        blog.title?.toLowerCase().includes(query.toLowerCase()) ||
        blog.authorName?.toLowerCase().includes(query.toLowerCase()) ||
        blog.technology?.toLowerCase().includes(query.toLowerCase());

      return timeCondition && searchCondition;
    });

    onFilter(filtered);
  }, [query, timeFilter, blogs, onFilter]);

  return (
    <Form className="d-flex mb-4" onSubmit={(e) => e.preventDefault()}>
      <Form.Control
        type="text"
        placeholder="Search blogs by technology, author, or title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={isDarkMode ? "bg-dark text-light" : ""}
      />
      <Button variant="outline-primary" type="submit">
        Search
      </Button>

      <Form.Select
        className={`ms-3 ${isDarkMode ? "bg-dark text-light" : ""}`}
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="recent">Recent (Last 7 Days)</option>
        <option value="1month">Last 1 Month</option>
        <option value="1year">Last 1 Year</option>
      </Form.Select>
    </Form>
  );
};

export default Search;
