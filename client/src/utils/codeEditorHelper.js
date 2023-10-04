const JAVA_LANG = "java";
const PYTHON_LANG = "python";

export function getSignitureByLanguage(funcSigniture, language) {
    switch (language) {
        case JAVA_LANG:
            return getJavaSigniture(funcSigniture);
        case PYTHON_LANG:
            return getPythonSigniture(funcSigniture);
        default:
            return funcSigniture;
    }
}

function getJavaSigniture(funcSigniture) {
    const javaArgs = funcSigniture.args.map(arg => `${arg.type} ${arg.value}`).join(", ");

    return `public static ${funcSigniture.returnType} ${funcSigniture.name}(${javaArgs}) {
  // write your java code here...
}`;
}

function getPythonSigniture(funcSigniture) {
    const pythonArgs = funcSigniture.args.map(arg => arg.value).join(", ");

    return `def ${funcSigniture.name}(${pythonArgs}):
  # write your python code here...`;
}