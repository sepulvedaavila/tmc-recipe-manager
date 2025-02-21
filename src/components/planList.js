// client/src/components/PlanList.js
import { Link } from 'react-router-dom';

const PlanList = () => {
  return (
    <div className="main-content">
      <h2>Meal Plans</h2>
      <Link to="/new-plan" className="btn btn-primary">
        New Plan
      </Link>
      {/* Existing plan list content */}
    </div>
  );
};

export default PlanList;