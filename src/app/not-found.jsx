const NotFound = () => {
  return (
    <div className="parallax-container">
      <div className="container d-flex text-center align-items-center justify-content-center error-page">
        <div>
          <div className="error-page__num">404</div>
          <h3 className="title title--h5 mb-3">Whoops!</h3>
          <p className="description">The page you’re looking for doesn’t exist or has been moved.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
