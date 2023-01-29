import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useQuery } from "@tanstack/react-query";
import DataTable, { createTheme } from "react-data-table-component";
import { CSVLink, CSVDownload } from "react-csv";

import { useState } from "react";

const SearchBarForm = ({ onSubmit }: any) => (
  <form
    className={styles.form}
    onSubmit={(event: any) => {
      event.preventDefault();
      onSubmit(event.target?.search?.value);
    }}
  >
    <input
      id="search"
      type="text"
      name="search"
      placeholder="Dog"
      // pattern="^(http|https)://.*"
      size={30}
      required
    />
    <button type="submit">Search</button>
  </form>
);

const Footer = () => (
  <footer className={styles.footer}>
    <a
      href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by DB
    </a>
  </footer>
);

const getSentimentAnalysis = (search: string) => {
  var url = "/api/hello";
  const params = new URLSearchParams({ search }).toString();
  console.log({ params });
  return fetch(`${url}?${params}`).then((value) => {
    console.log(value);
    return value.json();
  });
};

const useSentimentAnalyzer = (search: string) => {
  const searchText = search || "";
  const result = useQuery({
    queryKey: ["getSentimentAnalysis", searchText],
    queryFn: () => getSentimentAnalysis(searchText),
    enabled: search.length > 0,
  });

  return result;
};

createTheme("solarized", {
  text: {
    primary: "white",
    secondary: "white",
  },
  background: {
    default: "black",
  },
  context: {
    background: "black",
    text: "#FFFFFF",
  },
  // divider: {
  //   default: "#073642",
  // },
  // action: {
  //   button: "rgba(0,0,0,.54)",
  //   hover: "rgba(0,0,0,.08)",
  //   disabled: "rgba(0,0,0,.12)",
  // },
});

const columns = [
  {
    name: "Score",
    selector: (row: any) => row.score,
    sortable: true,
  },
  // {
  //   name: "Calculation",
  //   selector: (row: any) => row.calculation,
  //   sortable: true,
  // },
  {
    name: "Comparative",
    selector: (row: any) => row.comparative,
    sortable: true,
  },
  {
    name: "Negative",
    selector: (row: any) => row.negative,
    sortable: true,
  },
  {
    name: "Positive",
    selector: (row: any) => row.positive,
    sortable: true,
  },
  {
    name: "Tokens",
    selector: (row: any) => row.tokens,
    sortable: true,
  },
  {
    name: "Words",
    selector: (row: any) => row.words,
    sortable: true,
  },
];

const SearchForm = () => {
  const [searchText, setSearchText] = useState("");
  const { data } = useSentimentAnalyzer(searchText);
  console.log({ data });

  const handleSearch = (value: any) => {
    setSearchText(value);
  };

  const handleRowClicked = () => {};

  return (
    <>
      <SearchBarForm onSubmit={handleSearch} />
      {data && (
        <CSVLink data={data} target="_blank">
          Scarica CSV
        </CSVLink>
      )}
      <DataTable
        title="Results Summary"
        columns={columns}
        data={data}
        pagination
        onRowClicked={handleRowClicked}
        highlightOnHover
      />
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Twit Sentiment Analyzer</title>
        <meta name="description" content="GDPR Checker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="/about">Twit Sentiment Analyzer</a>
        </h1>
        <SearchForm />
      </main>

      <Footer />
    </div>
  );
}
