import { FunctionComponent, useState } from "react";
import { H1, H1Link } from "@fourviere/ui/lib/typography";
import { ImageLinkCard, ImageLinkCardContainer } from "@fourviere/ui/lib/cards";
import { Container, HalfPageBox } from "@fourviere/ui/lib/box";
import FullPageLayoutBackground from "@fourviere/ui/lib/layouts/full-page";
import appStore from "../../store/app";
import feedStore from "../../store/feed";
import StartByURL from "./start-by-url";
import StartByDrag from "./start-by-drag";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Drawer from "@fourviere/ui/lib/modals/drawer";
import StartByIndex from "./start-by-podcast-index";

interface StartViewProps {}

const StartView: FunctionComponent<StartViewProps> = () => {
  const { getTranslations, getConfigurations } = appStore((state) => state);
  const { projects, createProject } = feedStore((state) => state);
  const [startByUrlVisible, setStartByUrlVisible] = useState(false);
  const [startByIndexVisible, setStartByIndexVisible] = useState(false);

  const t = getTranslations();
  const isPodcastIndexEnabled = getConfigurations("podcastIndex").enabled;

  return (
    <FullPageLayoutBackground>
      <StartByDrag>
        <HalfPageBox>
          <Container spaceY="xl">
            <p>
              <H1Link onClick={createProject}>{t["start.create"]}</H1Link>
              <br />
              <H1>{t["start.or"]} </H1>
              <H1Link>{t["start.open_file"]}</H1Link>,{" "}
              <H1Link onClick={() => setStartByUrlVisible(true)}>
                {t["start.load_from_url"]}
              </H1Link>
              {isPodcastIndexEnabled && (
                <>
                  {" and "}
                  <H1Link onClick={() => setStartByIndexVisible(true)}>
                    {" "}
                    {t["start.load_from_podcastindex"]}
                  </H1Link>
                </>
              )}
            </p>

            <ImageLinkCardContainer>
              {Object.keys(projects)
                .reverse()
                .map((feed) => (
                  <ImageLinkCard
                    key={feed}
                    src={
                      projects[feed].feed.rss.channel[0].image?.url ||
                      projects[feed].feed.rss.channel[0]?.["itunes:image"]?.[
                        "@"
                      ]?.href ||
                      ""
                    }
                    showError={!projects[feed].configuration}
                  />
                ))}
            </ImageLinkCardContainer>
          </Container>
        </HalfPageBox>
      </StartByDrag>
      {createPortal(
        <AnimatePresence mode="wait">
          {startByUrlVisible && (
            <Drawer type="bottom" onClose={() => setStartByUrlVisible(false)}>
              <StartByURL done={() => setStartByUrlVisible(false)} />
            </Drawer>
          )}
        </AnimatePresence>,
        document.getElementById("drawer")!
      )}
      {createPortal(
        <AnimatePresence mode="wait">
          {startByIndexVisible && (
            <Drawer type="bottom" onClose={() => setStartByIndexVisible(false)}>
              <StartByIndex done={() => setStartByIndexVisible(false)} />
            </Drawer>
          )}
        </AnimatePresence>,
        document.getElementById("drawer")!
      )}
    </FullPageLayoutBackground>
  );
};

export default StartView;
