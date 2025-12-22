const Footer = () => {
  const footerStyle = {
    fontSize: '0.8rem',
    textAlign: 'center',
    padding: '1rem',
    borderTop: '1px solid #ccc',
    marginTop: '20px',
    fontStyle: 'italic'
  }

  return (
    <footer style={footerStyle}>
      Made by a clever goblin
    </footer>
  )
}

export { Footer }