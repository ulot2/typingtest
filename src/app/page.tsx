import { Header } from "@/components/Header";
import { Highscore } from "@/components/Highscore";
import { Main } from "@/components/Main";
import { Results } from "@/components/Results";
import { SpeedDetails } from "@/components/SpeedDetails";

export default function Home() {
  return (
    <div>
      <Header />
      <SpeedDetails />
      <Main />
      <Results />
      <Highscore />
    </div>
  );
}
