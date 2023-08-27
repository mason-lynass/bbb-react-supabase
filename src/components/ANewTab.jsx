// this is just like a modified <a> that has target="blank" rel="noopener noreferrer"
// pretty silly, i know. only used in Footer so far

export default function ANewTab ({text, href}) {

    // console.log(text)
    return (
        <a href={href} target="blank" rel="noopener noreferrer">{text}</a>
    )
}