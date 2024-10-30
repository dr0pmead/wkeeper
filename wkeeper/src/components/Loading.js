// components/Loading.js
import { Spinner } from '@nextui-org/react'; // или любой другой спиннер

const Loading = () => {
  return (
    <div className="loading-container">
      <Spinner size="large" />
      <p>Загрузка...</p>
    </div>
  );
};

export default Loading;
