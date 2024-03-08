package cn.moon;

import org.apache.commons.lang3.StringUtils;

import java.util.LinkedList;
import java.util.List;

public class ElTokenParser {


    public static final String[] ops = {"==", "!=", ">=", "<=", ">", "<"}; // 按长短排序
    public static final String[] LOGIC_FLAGS = {"&&", "||"};
    public static final char[] STR_FLAGS = {'\"', '\''};

    public static void main(String[] args) {
        String[] testArr = {
                "days > 123",
                "days > 123 && days < 456",
                "days > 1 || days < 6",
                "days > 1 && days <= 6 || ( days == 1 && reason == '临时有事' )",
                "days > 1 && days < 6 || ( days == 1 && reason == '临时有事' ) && days > 5",
                "( days > 1 && days < 6 ) || ( days == 1 && reason == '临时有事' )",
                "reason .contains( '临时有事' )",
                "( days > 1 && days < 6 ) || ( days == 1 && reason.contains( '临时有事' ) )"
        };


        for (int i = 0; i < testArr.length; i++) {

            String str = testArr[i];

            if (i == 3) {
                System.out.println(i);
            }
            System.out.printf("\n输入：[%s]%n", str);

            List<String> arr = new LinkedList<>();
            splitWords(str, arr);


            String resultStr = StringUtils.join(arr, " ");
            System.out.printf("结果：[%s]\t\t解析数组：%s%n", resultStr, arr);
            System.out.println(str.equals(resultStr));


        }


    }

    /**
     * 分词
     *
     * @param text
     * @param result
     */
    public static void splitWords(final String text, List<String> result) {
        if (text == null || text.isEmpty()) {
            return;
        }


        char[] chars = text.toCharArray();
        StringBuilder temp = new StringBuilder();

        int i = 0;

        // 正在解析字符串

        while (i < chars.length) {
            char c = chars[i];

            String str = isStr(chars, i);
            String fn = isFn(chars, i);
            String op = isOp(chars, i);
            String logic = isLogic(chars, i);

            String block = str != null ? str : fn != null ? fn : op != null ? op : logic;

            if (block != null) {
                flushTemp(temp, result);
                result.add(block);
                i = i + block.length();
                continue;
            }

            if (c == '(') {
                result.add(String.valueOf(c));
                i++;
                continue;
            }

            if (c == ')') {
                flushTemp(temp, result);

                result.add(String.valueOf(c));
                i++;

                continue;
            }


            temp.append(c);
            i++;
        }

        // add last str
        String lastStr = temp.toString().trim();
        if (lastStr.length() > 0) {
            result.add(lastStr);
        }


    }

    private static void flushTemp(StringBuilder temp, List<String> result) {
        String str = temp.toString().trim();
        if (!str.isEmpty()) {
            result.add(str);
        }
        temp.setLength(0);
    }

    private static String isOp(char[] chars, int index) {
        for (String str : ops) {
            int len = str.length();
            if (index + len > chars.length) {
                return null;
            }

            if (str.equals(new String(chars, index, len))) {
                return str;
            }
        }
        return null;
    }

    private static String isLogic(char[] chars, int index) {
        for (String str : LOGIC_FLAGS) {
            int len = str.length();
            if (index + len > chars.length) {
                return null;
            }

            if (str.equals(new String(chars, index, len))) {
                return str;
            }
        }
        return null;
    }

    // TODO 如果字符串中含有转义的情况 如 \"
    private static String isStr(char[] chars, int index) {
        char c = chars[index];

        for (char flag : STR_FLAGS) {
            if (c == flag) {
                for (int i = index + 1; i < chars.length; i++) {
                    char cur = chars[i];
                    if (cur == flag) {
                        String s = new String(chars, index, i - index + 1);
                        return s;
                    }
                }
            }
        }


        return null;
    }


    private static String isFn(char[] chars, int index) {
        char c = chars[index];
        if (c == '.') {
            for (int i = index + 1; i < chars.length; i++) {
                char cur = chars[i];
                if (cur == '(') {
                    String s = new String(chars, index +1, i - index -1);
                    return s;
                }
            }
        }


        return null;
    }
}
