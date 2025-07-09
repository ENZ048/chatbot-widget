import { useParams } from "react-router-dom";
import Chatbox from "../components/Chatbox";

const EmbedPage = () => {
  const { chatbotId } = useParams();
  return (
    <div style={{ height: "100vh", margin: 0 }}>
      <Chatbox chatbotId={chatbotId} />
    </div>
  );
};

export default EmbedPage;
