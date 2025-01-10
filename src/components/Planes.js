// FILE: Planes.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Plans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch('/api/planes');
      const data = await response.json();
      setPlans(data);
    };

    fetchPlans();
  }, []);

  return (
    <div>
      <h2>Planes</h2>
      <Link to="/nuevo-plan">
        <button className="primary-button">Nuevo Plan</button>
      </Link>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>{plan.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Plans;