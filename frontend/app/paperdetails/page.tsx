"use client"

import { ExpandableSidebar } from "@/components/tool-comp/common-comp/expandable-sidebar";
import Playground from "@/components/paperdetails-comp/Playground";
import Layout from "./layout";
import { Footer } from "@/components/global-comp/Footer";

const Page = () => {
  return (
    <div className="min-h-[100vh]">
      <div className="h-[100vh] bg-gray-100 overflow-y-scroll">
          <ExpandableSidebar />
          <Playground />
          <Footer />
      </div>
    </div>
  );
};

Page.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Page;