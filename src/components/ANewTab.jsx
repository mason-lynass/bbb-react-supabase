export default function ANewTab ({text, href}) {

    // console.log(text)
    return (
        <a href={href} target="blank" rel="noopener noreferrer">{text}</a>
    )
}