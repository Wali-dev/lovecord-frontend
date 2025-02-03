import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Submit from "./submit/page";
import History from "./history/page";
import Browse from "./browse/page";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {/* <Submit /> */}
      {/* <History /> */}
      <Browse />
      <Footer />
    </div>


  );
}
