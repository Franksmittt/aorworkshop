import os
import io

def generate_file_tree(directory, output_file, prefix=""):
    """
    Recursively generates a file tree and writes it to the output file.
    """
    items = sorted(os.listdir(directory))
    for i, item in enumerate(items):
        path = os.path.join(directory, item)
        is_last = i == len(items) - 1
        
        # Determine the correct tree branch characters
        branch_prefix = "└── " if is_last else "├── "
        new_prefix = prefix + ("    " if is_last else "│   ")
        
        output_file.write(f"{prefix}{branch_prefix}{item}\n")
        
        if os.path.isdir(path):
            generate_file_tree(path, output_file, new_prefix)

def combine_files_in_directory(directory, output_filename="combined_src_folder.txt"):
    """
    Generates a file tree and combines the contents of all files in a directory
    and its subdirectories into a single text file.
    """
    # The output file will be saved in the parent directory of the 'src' folder
    output_directory = os.path.dirname(directory)
    output_path = os.path.join(output_directory, output_filename)
    
    with io.open(output_path, 'w', encoding='utf-8') as output_file:
        output_file.write("================== FILE TREE ==================\n\n")
        generate_file_tree(directory, output_file)
        
        output_file.write("\n\n\n================== FILE CONTENTS ==================\n")
        
        for root, dirs, files in os.walk(directory):
            for file in sorted(files):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, directory)

                # Write the header for the file content
                output_file.write(f"\n\n==================== {relative_path} ====================\n\n")
                
                # Check for files that are not readable text files (e.g., binaries)
                try:
                    with io.open(file_path, 'r', encoding='utf-8') as input_file:
                        content = input_file.read()
                        output_file.write(content)
                except UnicodeDecodeError:
                    print(f"Skipping binary or unreadable file: {file_path}")
                    output_file.write("[Binary or unreadable file content skipped]\n")
                except Exception as e:
                    print(f"An error occurred with file {file_path}: {e}")
                    output_file.write(f"[Error reading file: {e}]\n")

if __name__ == "__main__":
    # The specific path to the 'src' folder you want to process
    src_folder_path = r"C:\Users\shop\Downloads\nextjs-tailwind-starter-template\nextjs-tailwind-starter\src"
    
    # Check if the path exists before trying to run the script
    if not os.path.isdir(src_folder_path):
        print(f"Error: The directory '{src_folder_path}' does not exist.")
    else:
        print(f"Starting script to process directory: {src_folder_path}")
        combine_files_in_directory(src_folder_path)
        print("Files combined successfully! The output is in combined_src_folder.txt")