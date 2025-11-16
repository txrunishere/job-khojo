import { Heading, PostJobForm } from "@/components";

export const PostJob = () => {
  return (
    <div className="space-y-8 px-4">
      <section>
        <Heading>Post a Job</Heading>
      </section>
      <main>
        <PostJobForm />
      </main>
    </div>
  );
};
