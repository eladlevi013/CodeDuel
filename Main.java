
import java.util.Arrays;
import java.util.Objects;

public class Main {
    public static String[] flattenStringMatrix(String[][] matrix) {
        int totalLength = 0;
        
        // Calculate the total length of the flattened array
        for (int i = 0; i < matrix.length; i++) {
            totalLength += matrix[i].length;
        }

        String[] result = new String[totalLength];
        int index = 0;

        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                result[index++] = matrix[i][j];
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.equals(flattenStringMatrix(new String[][]{{"a", "b"}, {"c", "d"}, {"e", "f"}}), new String[]{"a", "b", "c", "d", "e", "f"}) && Arrays.equals(flattenStringMatrix(new String[][]{{"hello"}, {"world"}}), new String[]{"hello", "world"}) && Arrays.equals(flattenStringMatrix(new String[][]{{"apple", "banana"}, {"cherry", "date"}}), new String[]{"apple", "banana", "cherry", "date"}));
    }
}