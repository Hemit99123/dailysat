'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type SwaggerProps = {
  spec: Record<string, any>,
};

const ReactSwagger: React.FC<SwaggerProps> = ({spec}) => {
    return <SwaggerUI spec={spec} />;

}
export default ReactSwagger;