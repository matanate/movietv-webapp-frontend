import React from "react";
import Container from "react-bootstrap/Container";

const Footer = () => {
  return (
    <Container className="py-3 my-4 border-top text-left ">
      <p className="text-body-secondary">
        © {new Date().getFullYear()} Matan Atedgi
      </p>
    </Container>
  );
};

export default Footer;
