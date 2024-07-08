import SubmitPage from "@/components/pages/Submit";
import { createClient } from "@/lib/supabase/server-props";

export default SubmitPage;

export async function getServerSideProps(context) {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    };
  }

  return {
    props: {
      user: data.user
    }
  };
}
