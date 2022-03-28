/// Calculates the byte size of a string
///
/// # Arguments
/// * `string` - The string to calculate the size of
///
/// # Returns
/// The size of the string in bytes
pub fn string_size(str: &String) -> usize {
    str.as_bytes().len()
}