# Standard FOIA Log Format (SFLF) Specification

## Version: 1.4.0

## Introduction

The Standard FOIA Log Format (SFLF) aims to standardize the disparate FOIA logs released by various government agencies. This document outlines the specifications for the SFLF, which is designed to facilitate easier access, comparison and analysis of FOIA logs.

## File Format

The SFLF should be a CSV (Comma Separated Values) file with UTF-8 encoding.

## Handling Miscellaneous Headers

Many FOIA logs come with miscellaneous header information for internal tracking or public information. All such headers must be discarded, and the FOIA log should start with just the proper column names.

## Columns

The SFLF will consist of the following standardized columns:

### 1. request id

- **Definition**: A unique identifier for each FOIA request.
- **Type**: String
- **Constraints**: Must be unique within the file.
- **Example**: "REQ1234"

### 2. requester

- **Definition**: The name of the individual or entity requesting the information.
- **Type**: String
- **Example**: "Jane Doe"

### 3. requester organization

- **Definition**: The organization the requester is affiliated with, if applicable.
- **Type**: String
- **Example**: "MuckRock"

### 4. subject

- **Definition**: A brief description of the request's subject matter.
- **Type**: String
- **Example**: "Police misconduct records"

### 5. date requested

- **Definition**: The date the request was made.
- **Type**: Date (YYYY-MM-DD)
- **Example**: "2023-09-20"

### 6. date completed

- **Definition**: The date the request was completed, if applicable.
- **Type**: Date (YYYY-MM-DD)
- **Constraints**: Interpreter uses the [Parser library](https://dateutil.readthedocs.io/en/stable/parser.html) and accepts a wide range of date formats.
- **Example**: "2023-10-15"

### 7. status

- **Definition**: The current status of the request, as roughly mapped to MuckRock's potential statuses. These statuses might have less-than-obvious meanings due to their historical nature, such as 'processed' referring to any request that is being currently worked on by an agency, while 'abandoned' can refer to a request that has been withdrawn.
- **Type**: Enumerated String
- **Allowed Values**: "processed", "appealing", "fix", "payment", "lawsuit", "rejected", "no_docs", "done", "partial", "abandoned", or empty
- **Example**: "processed"


## Status Normalization

For FOIA logs that have a "status" column, it must be standardized according to the allowed values. If a different term is used in the original log, it should be mapped to one of the allowed values based on accompanying synonym text files.

## Column Mapping

When converting logs with different column names, use accompanying text files with column synonyms to map them to the standard SFLF columns.

## Synonym Files

To aid in the conversion of non-standard FOIA logs, two text files are used:

1. **Status Synonyms File**: `status_synonyms.txt`
    - This file contains mappings of various status terms to the allowed values in the SFLF.
  
2. **Column Synonyms File**: `synonyms.txt`
    - This file contains mappings of various column names to the standard SFLF columns.

## Uploader

MuckRock staff members can access the FOIA Log Uploader tool. In addition to the data in the CSV, the following fields are requested during the upload process:

### 1. source

- **Definition**: Where the FOIA log was obtained. If possible, should be the original URL source. If not, should be descriptive such as "Provided via email to info@muckrock.com by J. Smith."
- **Type**: String
- **Example**: "FBI"

    
## For Developers

To implement this specification, follow these guidelines:

1. **Read the accompanying text files (status_synonyms.txt for status and synonyms.txt for columns) to dynamically map non-standard terms.**
2. **Validate the log for column and status consistency post-conversion.**
3. **Log any inconsistencies or issues for manual review.**

## Examples

_Real-world examples of FOIA logs, both before and after being converted to SFLF, should be added here._

## FAQs

Frequently asked questions (FAQs) to address common issues and solutions will be added here.

## Change Log

- Version 1.3.0: Included names of relevant synonym files and made additional refinements.
- Version 1.2.0: Updated 'status' allowed values to include empty, refined 'source' definition, and added date parsing constraints.
- Version 1.1.0: Added guidelines for handling miscellaneous headers, corrected 'requestor' to 'requester', and added this change log.
- Version 1.0.0: Initial draft.

## Conclusion

Adhering to the SFLF will enable easier aggregation and analysis of FOIA logs across multiple agencies. It's a step toward making government transparency more robust and accessible.
