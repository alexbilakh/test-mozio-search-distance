import styled from "@emotion/styled";
import { Box } from "@mui/material";

import SearchForm from "../components/SearchForm";

// ========== || START STYLED COMPONENTS || ========== //
const StyledContainer = styled(Box)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 50px;
`;
// ========== || END STYLED COMPONENTS || ========== //

const Home: React.FC = () => {
  return (
    <StyledContainer>
      <SearchForm readOnly={false} />
    </StyledContainer>
  );
};

export default Home;
