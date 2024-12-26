import { Box, Button, Flex, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import { debounce } from "lodash";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface sprintsTypes {
  id: number,
  sequence: number,
  name: string,
  state: string,
  linkedPagesCount: number,
  goal: string,
  sprintVersion: string,
  startDate: string,
  endDate: string,
  isoStartDate: string,
  isoEndDate: string,
  completeDate: string,
  isoCompleteDate: string,
  canUpdateSprint: boolean,
  remoteLinks: [],
  daysRemaining: number
}

interface progressType {
  inProgress: { hours: number, issues: number }, done: { hours: number, issues: number }, total: { hours: number, issues: number }
}

export default function App() {
  const [isClean, setIsClean] = useState<boolean>(false);
  const [prod, setProd] = useState<string | null>(null);
  const [isJira, setIsJira] = useState<boolean>(false);
  const [progress, setProgress] = useState<progressType | null>(null);
  const [sprintName, setSprintName] = useState<string | null>(null);
  // const [sprintRange, setSprintRange] = useState<{ start: string, end: string } | null>(null);
  const cache = useRef(null);
  const debouncedfetch = useRef(debounce( async () => {
    const params = `activeQuickFilters=3670&hideCardExtraFields=true&includeHidden=true&moduleKey=agile-mobile-board-service&onlyUseEpicsFromIssues=true`;
    const targetUrl = `https://104corp.atlassian.net/rest/boards/latest/board/316`;
    const response = await fetch(`${targetUrl}?${params}`);
    const resData = await response.json();
    
    if (response.status === 200 && resData) {
      const { sprints, columns } = resData;
      const latestSprint: sprintsTypes = sprints.reduce((a: sprintsTypes, b: sprintsTypes) => {
        return new Date(a.isoEndDate) > new Date(b.isoEndDate) ? a : b;
      })
      let progress: progressType = {
        inProgress: { hours: 0, issues: 0 }, done: { hours: 0, issues: 0 }, total: { hours: 0, issues: 0 }
      };
      columns.map(statusBlock => {
        const currentIssues = statusBlock.issues.filter(issue => issue.sprintIds.indexOf(latestSprint.id) > -1 && issue.isVisible);
        currentIssues.length > 0 && currentIssues.map(issue => {
          switch (statusBlock.name) {
            case 'To Do':
            case '等待重做':
            case 'In Progress':
              progress.inProgress.hours += Number(issue.estimation);
              progress.inProgress.issues += 1;
              progress.total.hours += Number(issue.estimation);
              progress.total.issues += 1;
              break;
            case "等待上LAB":
            case "LAB測試中":
            case "等待上STG":
            case "STG測試中":
            case "準備上線":
            case "上線確認":
            case "Done":
              progress.done.hours += Number(issue.estimation);
              progress.done.issues += 1;
              progress.total.hours += Number(issue.estimation);
              progress.total.issues += 1;
              break;
            default: 
              break;
          }
        })
      });
      setSprintName(latestSprint.name)
      setProgress(progress);
    }
  }, 500));

  useEffect(() => {
    let ignore = false;
    if (!cache.current) {
      chrome.tabs.query({
        currentWindow: true,
        active: true,
      }).then((curr) => {
        if (curr[0].url.includes('https://104corp.atlassian.net/jira')) {
          chrome.tabs.sendMessage(
            curr[0].id,
            {
              action: "getProjectData",
            },
            (res) => {
              if (res) setProd(res.product);
            }
          );
          chrome.storage.local.get(["isClean"]).then((res) => {
            setIsClean(res["isClean"]);
          });
          debouncedfetch.current();
          setIsJira(true);
        }
      })
    }
    return () => { ignore = true };
  }, []);

  return (
    <HStack sx={{
      '>div:nth-child(2)': {
        borderLeft: `1px solid var(--chakra-colors-gray-300)`,
      },
      minHeight: '250px'
    }} spacing='0'>
      {isJira && progress && sprintName ? (
        <>
          <VStack {...{
            w: '350px',
            spacing: 4
          }}>
            <VStack w='100%'>
              <Text {...{
                as: 'span',
                color: 'white',
                bg: 'red.600',
                borderRadius: `8px`,
                px: 3,
                py: 1,
                fontWeight: 'bold'
              }}>Current Sprint</Text>
              <Text {...{
                as: 'h1',
                fontSize: 'xl',
                fontWeight: 'bold'
              }}>{sprintName}</Text>
            </VStack>
            <VStack>
              <Text {...{
                as: 'h1',
                fontSize: '5xl',
                textAlign: `center`
              }}>{Number(((progress.done.hours / progress.total.hours) * 100).toFixed(2))}%</Text>
            </VStack>
            <HStack spacing='4'>
              <Text fontSize='md'>已完成</Text>
              <Text {...{
                p: 2,
                borderRadius: '8px',
                color: 'white',
                bg: 'teal.600'
              }}>
                <Text {...{
                  as: 'span',
                  fontSize: 'lg',
                  fontWeight: 'bold'
                }}>{progress.done.hours}</Text>
                <Text {...{
                  as: 'span',
                  fontSize: 'md'
                }}> / {progress.total.hours} 小時</Text>
              </Text>
              <Text {...{
                p: 2,
                borderRadius: '8px',
                color: 'white',
                bg: 'blue.600'
              }}>
                <Text {...{
                  as: 'span',
                  fontSize: 'lg',
                  fontWeight: 'bold'
                }}>{progress.done.issues}</Text>
                <Text {...{
                  as: 'span',
                  fontSize: 'md'
                }}> / {progress.total.issues} 工項</Text>
              </Text>
            </HStack>
          </VStack>
          <VStack {...{
            w: '200px'
          }}>
            <Flex {...{
              w: '100%',
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
                    chrome.tabs.query({
                      currentWindow: true,
                      active: true,
                    }).then(q => {
                      console.log(q[0].id);
                      chrome.tabs.sendMessage(
                        q[0].id,
                        {
                          action: "clearJiraTop",
                          isClean: !isClean,
                        },
                        (res) => {
                          console.log(res);
                        }
                      );
                      setIsClean(!isClean);
                    })
                  });
                }}
              />
            </Flex>
            {prod && (
              <Flex w='100%' justify='center' p='4' borderTop='1px solid var(--chakra-colors-gray-300)' flexFlow='row wrap'>
                <Text as='h3' textAlign='center' mb='4'>{prod}</Text>
                <Button
                  colorScheme='teal'
                  onClick={() => {
                    navigator.clipboard.writeText(prod).then(() => {
                      alert("copy!");
                    });
                  }}
                >
                  複製工單
                </Button>
              </Flex>  
            )}
          </VStack>
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
    </HStack>
  );
}
