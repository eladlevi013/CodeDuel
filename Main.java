
import java.util.Arrays;
import java.util.Objects;

public class Main {
    public static int findLargest(int[] arr) {
	        // Check for an empty array
	        if (arr == null || arr.length == 0) {
	            throw new IllegalArgumentException("Array should not be empty or null.");
	        }
	
	        // Start with the first number in the array as the largest
	        int largest = arr[0];
	
	        // Loop through the rest of the array
	        for (int num : arr) {
	            // If we find a number larger than our current largest, update the largest
	            if (num > largest) {
	                largest = num;
	            }
	        }
	
	        return largest;
	    }
    
	    public static void main(String[] args) {
	        System.out.println(Objects.equals(findLargest(new int[]{1,5,8,3}), 8) && 
			Objects.equals(findLargest(new int[]{12,4,5,9}), 12) && 
			Objects.equals(findLargest(new int[]{-1,-5,-8,-3}), -1) && 
			Objects.equals(findLargest(new int[]{-12,0,-15,20}), 20) && 
			Objects.equals(findLargest(new int[]{100,200,300,400}), 400));
	    }
}