import React from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';

interface ButtonProps {
  text?: string;
  onClick?: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ text = "Chat Helix", onClick }) => {
  return (
    <StyledWrapper onClick={onClick}>
      <div className="btn-shine">
        {text}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-2 inline-block">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn-shine {
    position: relative;
    padding: 12px 48px;
    color: #111827;
    background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
    background-position: 0;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s infinite linear;
    animation-fill-mode: forwards;
    -webkit-text-size-adjust: none;
    font-weight: 600;
    font-size: 24px;
    text-decoration: none;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
  }
  
  /* Reset fill color for the icon since background-clip: text hides it otherwise */
  .btn-shine svg {
    -webkit-text-fill-color: initial;
    color: #111827;
  }

  @-moz-keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }
  @-webkit-keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }
  @-o-keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }
  @keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }`;

export default CustomButton;
