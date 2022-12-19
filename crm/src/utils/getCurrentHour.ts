export default function getCurrentHour() {
    const t = new Date();
    const hours = t.getHours();

    if (hours > 12) return `${hours - 12} PM`;

    return `${hours} AM`;
}