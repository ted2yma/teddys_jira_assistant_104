import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function App() {
  const [isClean, setIsClean] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(["isClean"]).then((res) => {
      console.log(res);

      setIsClean(res["isClean"]);
    });
  }, []);

  return (
    <div>
      isClean: {isClean ? `true` : `false`}
      <Button
        onClick={() => {
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
      >
        switch
      </Button>
      <Button
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
        Getter
      </Button>
    </div>
  );
}
