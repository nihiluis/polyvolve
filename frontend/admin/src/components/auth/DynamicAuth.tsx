import dynamic from "next/dynamic"

export const DynamicAuth = dynamic(() => import("./Auth"), {
  ssr: false,
  loading: () => <p></p>,
})
