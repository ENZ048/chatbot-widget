import { useParams } from 'react-router-dom';
import Chatbox from './components/Chatbox';

function App() {
  const { chatbotId } = useParams();
  return <Chatbox chatbotId={chatbotId} />;
}

export default App;