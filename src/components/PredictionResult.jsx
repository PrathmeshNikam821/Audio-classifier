import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

const PredictionResult = ({ prediction }) => {
  return (
    <Card className="mt-4" style={{ textAlign: 'center' }}>
      <CardBody>
        <CardTitle tag="h5">Prediction Result</CardTitle>
        <CardText>{prediction}</CardText>
      </CardBody>
    </Card>
  );
};

export default PredictionResult;
