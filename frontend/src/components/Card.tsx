
import React from 'react';
import './style/Card.css';

interface CardProps {
  title: string;
  description: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, description, link }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={link}>Go to {title}</a>
    </div>
  );
};

export default Card;
