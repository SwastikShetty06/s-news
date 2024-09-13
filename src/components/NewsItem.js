import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const NewsItem = ({ title, description, url, image }) => {
    return (
        <div className="news-item">
        <Card bg="Secondary" style={{ width: '60rem' }}>
            <Card.Img variant="top" src={image} />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>
                <Button variant="primary"><a href={url} rel="url"  >Read more</a></Button>
            </Card.Body>
        </Card>
        </div>
    );
};

export default NewsItem;
