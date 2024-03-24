function Card(props) {
  const { cardName, cardContent } = props;
  return (
    <div className="col-6 col-sm">
      <div className="card card-lg-sm text-center">
        <div className="card-header text-nowrap" title={cardName}>
          {cardName}
        </div>
        <div className="card-body" style={{ minHeight: "65px" }}>
          <h4 className="card-title mb-0 monospace">{cardContent}</h4>
        </div>
      </div>
    </div>
  );
}

export default Card;
