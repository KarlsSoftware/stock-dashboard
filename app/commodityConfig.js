/**
 * Commodity Configuration
 *
 * Defines all available commodities organized by category.
 * Each commodity has:
 * - name: Display name
 * - symbol: Yahoo Finance symbol (ABC=F format)
 * - keywords: GDELT search keywords for news (OR-separated terms)
 *
 * Symbol format: ABC=F where:
 * - ABC = commodity code (e.g., GC for Gold)
 * - =F = front month futures contract
 */

export const commodityCategories = [
  {
    name: "Precious Metals",
    commodities: [
      {
        name: "Gold",
        symbol: "GC=F",
        keywords: "\"gold prices\" OR \"gold market\" OR XAUUSD OR \"gold futures\" OR \"gold trading\""
      },
      {
        name: "Silver",
        symbol: "SI=F",
        keywords: "\"silver prices\" OR \"silver market\" OR XAGUSD OR \"silver futures\" OR \"silver trading\""
      },
      {
        name: "Platinum",
        symbol: "PL=F",
        keywords: "\"platinum prices\" OR \"platinum market\" OR \"platinum futures\" OR \"platinum trading\""
      },
      {
        name: "Palladium",
        symbol: "PA=F",
        keywords: "\"palladium prices\" OR \"palladium market\" OR \"palladium futures\" OR \"palladium trading\""
      },
    ],
  },
  {
    name: "Energy",
    commodities: [
      {
        name: "WTI Crude Oil",
        symbol: "CL=F",
        keywords: "\"crude oil prices\" OR \"oil market\" OR \"WTI crude\" OR \"oil futures\" OR \"crude trading\""
      },
      {
        name: "Brent Crude Oil",
        symbol: "BZ=F",
        keywords: "\"Brent crude\" OR \"Brent oil\" OR \"oil market\" OR \"Brent futures\" OR \"oil prices\""
      },
      {
        name: "Natural Gas",
        symbol: "NG=F",
        keywords: "\"natural gas prices\" OR \"gas market\" OR \"natural gas futures\" OR \"gas trading\""
      },
      {
        name: "Heating Oil",
        symbol: "HO=F",
        keywords: "\"heating oil prices\" OR \"heating oil market\" OR \"heating oil futures\""
      },
      {
        name: "RBOB Gasoline",
        symbol: "RB=F",
        keywords: "\"gasoline prices\" OR \"RBOB gasoline\" OR \"gasoline market\" OR \"gasoline futures\""
      },
    ],
  },
  {
    name: "Grains",
    commodities: [
      {
        name: "Corn",
        symbol: "ZC=F",
        keywords: "\"corn prices\" OR \"corn market\" OR \"corn futures\" OR \"grain trading\" OR maize"
      },
      {
        name: "Wheat",
        symbol: "ZW=F",
        keywords: "\"wheat prices\" OR \"wheat market\" OR \"wheat futures\" OR \"grain trading\""
      },
      {
        name: "Soybeans",
        symbol: "ZS=F",
        keywords: "\"soybean prices\" OR \"soybean market\" OR \"soybean futures\" OR \"soy trading\""
      },
      {
        name: "Oats",
        symbol: "ZO=F",
        keywords: "\"oats prices\" OR \"oats market\" OR \"oats futures\" OR \"grain trading\""
      },
    ],
  },
  {
    name: "Soft Commodities",
    commodities: [
      {
        name: "Coffee",
        symbol: "KC=F",
        keywords: "\"coffee prices\" OR \"coffee market\" OR \"coffee futures\" OR \"coffee trading\""
      },
      {
        name: "Sugar",
        symbol: "SB=F",
        keywords: "\"sugar prices\" OR \"sugar market\" OR \"sugar futures\" OR \"sugar trading\""
      },
      {
        name: "Cotton",
        symbol: "CT=F",
        keywords: "\"cotton prices\" OR \"cotton market\" OR \"cotton futures\" OR \"cotton trading\""
      },
      {
        name: "Cocoa",
        symbol: "CC=F",
        keywords: "\"cocoa prices\" OR \"cocoa market\" OR \"cocoa futures\" OR \"cocoa trading\""
      },
      {
        name: "Orange Juice",
        symbol: "OJ=F",
        keywords: "\"orange juice prices\" OR \"orange juice market\" OR \"OJ futures\" OR \"citrus market\""
      },
    ],
  },
  {
    name: "Industrial Metals",
    commodities: [
      {
        name: "Copper",
        symbol: "HG=F",
        keywords: "\"copper prices\" OR \"copper market\" OR \"copper futures\" OR \"copper trading\""
      },
    ],
  },
  {
    name: "Livestock",
    commodities: [
      {
        name: "Live Cattle",
        symbol: "LE=F",
        keywords: "\"cattle prices\" OR \"cattle market\" OR \"livestock futures\" OR \"beef market\""
      },
      {
        name: "Lean Hogs",
        symbol: "HE=F",
        keywords: "\"hog prices\" OR \"pork market\" OR \"hog futures\" OR \"livestock trading\""
      },
      {
        name: "Feeder Cattle",
        symbol: "GF=F",
        keywords: "\"feeder cattle\" OR \"cattle market\" OR \"livestock futures\" OR \"cattle prices\""
      },
    ],
  },
];
