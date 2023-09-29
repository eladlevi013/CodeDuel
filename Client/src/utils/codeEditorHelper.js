const JAVA_LANG = "java";
const PYTHON_LANG = "python";
const JAVASCRIPT_LANG = "javascript";

export function getSignitureByLanguage(funcSigniture, language) {
    switch (language) {
        case JAVA_LANG:
            return getJavaSigniture(funcSigniture);
        case PYTHON_LANG:
            return getPythonSigniture(funcSigniture);
        case JAVASCRIPT_LANG:
            return getJavascriptSigniture(funcSigniture);
        default:
            return funcSigniture;
    }
}

function getJavaSigniture(funcSigniture) {
    const javaArgs = funcSigniture.args.map(arg => `${arg.type} ${arg.name}`).join(", ");

    return `public static ${funcSigniture.returnType} ${funcSigniture.name}(${javaArgs}) {
  // write your java code here...
}`;
}

function getPythonSigniture(funcSigniture) {
    const pythonArgs = funcSigniture.args.map(arg => arg.name).join(", ");

    return `def ${funcSigniture.name}(${pythonArgs}):
  # write your python code here...`;
}

function getJavascriptSigniture(funcSigniture) {
    const javascriptArgs = funcSigniture.args.map(arg => arg.name).join(", ");

    return `function ${funcSigniture.name}(${javascriptArgs}) {
  // write your javascript code here...
}`;
}