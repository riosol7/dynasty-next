import TeamPage from "@/pages/Team";
import * as Interfaces from "@/interfaces";

export default function Team({ params: { name }}: Interfaces.TeamParams) {
    return (
        <TeamPage name={name}/>
    );
};
