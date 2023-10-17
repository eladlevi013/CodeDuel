
import java.util.Arrays;
import java.util.Objects;

public class Main {
    public static boolean isAscending(int[] arr) {
  int counter = 0;

  while (counter < arr.length - 1) {
    if (arr[counter] > arr[counter + 1]) {
      return false;
    }

    counter++;
  }

  return true;
}
    
    public static void main(String[] args) {
        System.out.println(Objects.equals(isAscending(new int[]{1, 2, 3, 4}), true) && Objects.equals(isAscending(new int[]{1, 3, 2, 4}), false) && Objects.equals(isAscending(new int[]{5, 6, 7, 8}), true));
    }
}