import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function App() {
  const [isClean, setIsClean] = useState<boolean>(false);
  const [prod, setProd] = useState<string | null>(null);

  useEffect(() => {
    chrome.tabs.query({
      currentWindow: true,
      active: true,
    }).then(curr => {
      chrome.tabs.sendMessage(
        curr[0].id,
        {
          action: "getProjectData",
        },
        (res) => {
          setProd(res.product)
        }
      );
    })
    chrome.storage.local.get(["isClean"]).then((res) => {
      setIsClean(res["isClean"]);
    });
  }, []);

  console.log(prod);
  

  return (
    <Box pb="4">
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
    </Box>
  );
}
