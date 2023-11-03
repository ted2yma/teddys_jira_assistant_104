import { Box, Text } from "@chakra-ui/react";

function App() {
  return (
    <Box {...{
      className: `App`,
      p: 2
    }}>
      <Text>Thank you for using</Text>
      <Text>Teddys Jira Assistant</Text>
    </Box>
  );
}

export default App;
