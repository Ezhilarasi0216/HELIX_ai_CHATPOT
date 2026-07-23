import React from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  perspective: 1000px;
  background: radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000 100%);

  .grid-inner {
    position: absolute;
    inset: 0;
    height: 200%;
    width: 200%;
    top: -50%;
    left: -50%;
    background-image: 
      linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    transform: rotateX(60deg);
    animation: grid-move 20s linear infinite;
    mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 80%);
  }

  @keyframes grid-move {
    from { background-position: 0 0; }
    to { background-position: 0 60px; }
  }

  .ambient-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
  }

  .horizon {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(99, 102, 241, 0.2), transparent);
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
  }
`;

export const RetroGrid: React.FC = () => {
  return (
    <GridContainer>
      <div className="ambient-glow" />
      <div className="grid-inner" />
      <div className="horizon" />
    </GridContainer>
  );
};
