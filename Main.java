
import java.util.Arrays;
import java.util.Objects;

public class Main {
    public static int[] fibonacci(int n) {
	        int[] sequence = new int[n+1];
	        if (n >= 0) {
	            sequence[0] = 0;
	        }
	        if (n >= 1) {
	            sequence[1] = 1;
	        }
	        for (int i = 2; i <= n; i++) {
	            sequence[i] = sequence[i - 1] + sequence[i - 2];
	        }
	        return sequence;
	    }
    
	    public static void main(String[] args) {
	        System.out.println(Arrays.equals(fibonacci(5), new int[]{0,1,1,2,3,5}) && 
			Arrays.equals(fibonacci(7), new int[]{0,1,1,2,3,5,8,13}) && 
			Arrays.equals(fibonacci(10), new int[]{0,1,1,2,3,5,8,13,21,34,55}));
	    }
}