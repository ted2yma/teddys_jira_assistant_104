import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

export default function App() {
  const [isClean, setIsClean] = useState<boolean>(false);
  const [prod, setProd] = useState<string | null>(null);
  const [isJira, setIsJira] = useState<boolean>(false);
  const cache = useRef(null);

  useEffect(() => {
    let ignore = false;
    if (!cache.current) {
      chrome.tabs.query({
        currentWindow: true,
        active: true,
      }).then(curr => {
        if (curr[0].url.includes('https://104corp.atlassian.net/jira')) {
          setIsJira(true);
          chrome.tabs.sendMessage(
            curr[0].id,
            {
              action: "getProjectData",
            },
            (res) => {
              setProd(res.product)
            }
          );
          chrome.storage.local.get(["isClean"]).then((res) => {
            setIsClean(res["isClean"]);
          });
          // async function fetchApi () {
          //   const response = await fetch('https://104corp.atlassian.net/rest/boards/latest/board/316?activeQuickFilters=3670&hideCardExtraFields=true&includeHidden=true&moduleKey=agile-mobile-board-service&onlyUseEpicsFromIssues=true');
          //   const resData = await response.json();
          //   return resData.data;
          // }
          // const response = fetchApi();
        }
      })
    }
    return () => { ignore = true };
  }, []);

  return (
    <Box pb="4">
      {isJira ? (
        <>
          <Flex {...{
            w: '250px',
            h: '250px',
            justify: `center`,
            align: `center`,
            flexFlow: `column wrap`
          }}>
            <Text as='h1' fontSize='xl' mb="4">全頁模式{isClean ? `開啟`: `關閉`}</Text>
            <Switch
              isChecked={isClean}
              size='lg'
              onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                chrome.storage.local.set({ isClean: false }).then(async () => {
                  const curr = await chrome.tabs.query({
                    currentWindow: true,
                    active: true,
                  });

                  chrome.tabs.sendMessage(
                    curr[0].id,
                    {
                      action: "clearJiraTop",
                      isClean: !isClean,
                    },
                    (res) => {
                      console.log(res);
                    }
                  );
                  setIsClean(!isClean);
                });
              }}
            />
          </Flex>
          <Flex justify='center' pt='4' px='4' borderTop='1px solid #ddd' flexFlow='row wrap'>
            {prod && <Text as='h3' textAlign='center' mb='4'>{prod}</Text>}
            <Button
              colorScheme='teal'
              onClick={async () => {
                const curr = await chrome.tabs.query({
                  currentWindow: true,
                  active: true,
                });
                chrome.tabs.sendMessage(
                  curr[0].id,
                  {
                    action: "getProjectData",
                  },
                  (res) => {
                    console.log(res);
                    navigator.clipboard.writeText(res.product).then(() => {
                      alert("copy!");
                    });
                  }
                );
              }}
            >
              複製工單
            </Button>
          </Flex>
        </>
      ) : (
        <Flex {...{
          w: '250px',
          h: '250px',
          justify: `center`,
          align: `center`
        }}>
          <Text as='h1' fontSize='xl' textAlign='center'>你沒在Jira頁面餒...</Text>
        </Flex>
      )}
    </Box>
  );
}
