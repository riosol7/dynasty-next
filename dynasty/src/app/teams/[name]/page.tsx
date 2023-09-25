import TeamPage from "@/pages/Team";

export default function Team({
    params: { name }
}: {
    params: {
        name: string;
    };
}) {
    return (
        <TeamPage name={name}/>
    );
};
