export default function ANewTab ({text, href}) {

    return (
        <a href={href} target="blank" rel="noopener noreferrer">{text}</a>
    )
}